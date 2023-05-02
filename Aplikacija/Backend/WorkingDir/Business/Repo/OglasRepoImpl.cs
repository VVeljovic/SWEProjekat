using Business.Contexts;
using Domain.IRepo;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Domain.Exceptions;
using System.Linq.Expressions;
using Domain.IRepo.Utility;
using Business.Repo.Utility;
using Models;

namespace Business.Repo
{
    
    public class OglasRepoImpl : IOglasRepo
    {
        private IWebHostEnvironment _environment;
        private OrderByMapperOglas _orderByMapper;
        private const int  MAX_BR_SLIKA= 5;
        private const string SLIKE_FOLDER = "SlikeOglasa";
        private readonly string[] EXTENSIONS = new string[] {".jpg", ".png", ".jpeg" };
        //10MB
        private const long MAX_VELICINA_SLIKE = 10*0b1_00000_00000_00000_00000;
        private string FOLDER_PATH;
        private readonly NaGlasuContext _context;

        public OglasRepoImpl(NaGlasuContext context,IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
            FOLDER_PATH = Path.Combine(_environment.WebRootPath,SLIKE_FOLDER);
            _orderByMapper = new OrderByMapperOglas();
            if(!Directory.Exists(FOLDER_PATH))
            {
                Directory.CreateDirectory(FOLDER_PATH);
            }
        }

        public async Task<List<Slika>> PostaviSlike(List<IFormFile> slike)
        {
            if(slike.Count>MAX_BR_SLIKA)
                throw new MaxBrSlikaException(MAX_BR_SLIKA);

            List<Slika> Slike = new List<Slika>(slike.Count);

            int counter = 0;
            foreach(IFormFile slika in slike)
            {
                //if(slika.ContentType!="image/jpeg"||slika.ContentType!="image/png") ne radi?
                    //return BadRequest($"Slika {slika.FileName} je nedozvoljenog tipa (dozvoljene su samo png i jpg slike)");
                String extension = Path.GetExtension(slika.FileName);
                if(!EXTENSIONS.Contains(extension))
                    throw new NedozvoljenaEkstenzijaException(extension);
                if(slika.Length>MAX_VELICINA_SLIKE)
                    throw new VeliakSlikaException(slika.FileName, MAX_VELICINA_SLIKE);
                string fPath;
                do {
                    fPath = Path.Combine(FOLDER_PATH,RandomString.GenerateFilename(extension));
                } while (System.IO.File.Exists(fPath));
                Slike.Add(new Slika(fPath,counter++));
            }

        for (int i = 0; i != slike.Count;++i)
        {
            using(FileStream fs = System.IO.File.Create(Slike[i].Path))
            {
                await slike[i].CopyToAsync(fs);
                fs.Flush();
            }
        }
            return Slike;
        }

        public async Task SacuvajOglas(Oglas oglas)
        {
            _context.Oglasi.Add(oglas);
            await _context.SaveChangesAsync();
        }   

        public async Task<int> PrebrojiOglaseZaFiltere(OglasFilteri? filters)
        {
            Expression<Func<Oglas, bool>> predicate = (o) => true;
            if(filters!=null)
                predicate = filters.Map();
            return await _context.Oglasi.Where(predicate).CountAsync();
        }

        public async Task<List<Oglas>> VratiMtihNOglasa(int N, int M, OglasFilteri? filteri)
        {
            Expression<Func<Oglas, bool>> predicate = (o) => true;
            if(filteri!=null)
                predicate = filteri.Map();
            var tmp = _context.Oglasi.Where(predicate).OrderBy(o=>o.Id).Skip(M * N).Take(N).Include(o => o.Podkategorija)
            .Include(o => o.Vlasnik)
             .Join(_context.Kategorije,
            o => o.Podkategorija.KategorijaId, k => k.Id, (o, k) =>
            new Oglas
            {
                Id = o.Id, Ime = o.Ime, Podkategorija = new Podkategorija{Id = o.Podkategorija.Id, Ime=o.Podkategorija.Ime,
                    KategorijaId=o.Podkategorija.KategorijaId, KategorijaNaziv=k.Ime},
                Polja=o.Polja, Kredit=o.Kredit, DatumPostavljanja=o.DatumPostavljanja, Smer=o.Smer, Tip=o.Tip, Cena=o.Cena,
                Kolicina=o.Kolicina,BrojPregleda=o.BrojPregleda, Vlasnik = new Korisnik {Id=o.Vlasnik.Id,UserName=o.Vlasnik.UserName},
                Stanje=o.Stanje,Lokacija=o.Lokacija
            });

            var list = await tmp.ToListAsync();
            if(list==null)
                list = new List<Oglas>();
            return list;
        }

        public Oglas? VratiOglas(long oglasId,Expression<Func<Oglas,object>>? lambda)
        {
            return lambda!=null?_context.Oglasi.Where(o=>o.Id==oglasId).Include(lambda).FirstOrDefault()
            :_context.Oglasi.Where(o=>o.Id==oglasId).FirstOrDefault();
        }

        public async Task<List<Oglas>> VratiOglase(long[] oglasIds, Expression<Func<Oglas, object>>? lambdaInclude)
        {
            return await (lambdaInclude != null ? _context.Oglasi.Where(o => oglasIds.Contains(o.Id)).Include(lambdaInclude).ToListAsync() :
            _context.Oglasi.Where(o => oglasIds.Contains(o.Id)).ToListAsync());
        }

        public async Task AzurirajOglas(Oglas oglas)
        {
            _context.Oglasi.Update(oglas);
            await _context.SaveChangesAsync();
        }

        public void ObrisiOglas(Oglas oglas)
        {
            _context.Oglasi.Remove(oglas);
            _context.SaveChanges();
        }

        public void DodajFavorita(FavoritSpoj favorit)
        {
            var korisnik = _context.Korisnici.Where(k => k.UserName == favorit.Korisnik.UserName).FirstOrDefault();
            if(korisnik==null)
                throw new NullKorisnikException(favorit.Korisnik.UserName);
            var oglas = VratiOglas(favorit.Oglas.Id,null);
            if(oglas==null)
                throw new NullOglasException(favorit.Oglas.Id);
            favorit.Oglas = oglas;
            favorit.Korisnik = korisnik;
            _context.Favoriti.Add(favorit);
            _context.SaveChanges();
        }

        public void SkiniFavorita(int Id)
        {
            var fav = _context.Favoriti.Find(Id);
            if(fav==null)
                throw new NullFavoritSpojException();
            _context.Remove(fav);
            _context.SaveChanges();
        }

        public bool JelFavorit(long oglasId,string username)
        {
            return null!=_context.Favoriti.Where(f => f.Oglas.Id == oglasId).Join(_context.Korisnici, f => f.Korisnik.Id, u => u.Id, (f, u) => new
            {
                Username=u.UserName
            }).Where(at=>at.Username==username).FirstOrDefault();
        }
    }
}