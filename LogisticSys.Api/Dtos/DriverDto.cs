namespace LogisticSys.Api.Dtos
{
    public class DriverDto
    {
        public int DriverId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string LicenseNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Availability { get; set; } = string.Empty;
    }
}