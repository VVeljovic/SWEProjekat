namespace Domain.Models;

public class UgovorPorukaDto
{
    public string Opis{ get; set; }
    public int Kolicina{ get; set; }
    public bool Prihvacen{ get; set; }

    public bool Odbijen{ get; set; }

    public long Id{ get; set; }

    public bool Ocenjen{ get; set; }

    public UgovorPorukaDto(string opis, int kolicina, bool prihvacen,bool odbijen, long id,bool ocenjen)
    {
        Opis = opis;
        Kolicina = kolicina;
        Prihvacen = prihvacen;
        Odbijen = odbijen;
        Id = id;
        Ocenjen = ocenjen;
    }
}