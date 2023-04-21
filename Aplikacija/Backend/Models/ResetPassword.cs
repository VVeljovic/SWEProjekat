using System.ComponentModel.DataAnnotations;

namespace Models;
public class ResetPassword
{
    [Required]
    public string Password{get;set;}=null!;
    [Compare("Password",ErrorMessage ="The password and confirmation password don't match!")]
    public string ConfrimPassword{get;set;}=null!;
    public string Email { get; set; }=null!;
    public string Token { get; set; }=null!;
}