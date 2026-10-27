using System.ComponentModel.DataAnnotations;

namespace ImanAcademy
{
    public record GoogleTokenRequest([Required] string IdToken);
}
