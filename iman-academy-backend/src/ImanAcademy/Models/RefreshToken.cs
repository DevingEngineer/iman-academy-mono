namespace ImanAcademy.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string UserId { get; set; } = default!;
        public ApplicationUser User { get; set; } = default!;

        public string TokenHash { get; set; } = default!;   // store hash, never the raw token
        public Guid FamilyId { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? RevokedAt { get; set; }
        public string? ReplacedByTokenHash { get; set; }     // for audit trail on rotation

        public bool IsActive => RevokedAt is null && DateTime.UtcNow < ExpiresAt;
    }
}
