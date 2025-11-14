namespace LogisticSys.Api.Dtos
{
    public class AvailableDriverDto
    {
        public int DriverId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}