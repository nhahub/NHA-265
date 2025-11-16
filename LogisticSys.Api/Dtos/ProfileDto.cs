namespace LogisticSys.Api.Dtos
{
    public class ProfileDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = string.Empty;

        public string? Address { get; set; }
        public string? LicenseNumber { get; set; }
    }
}