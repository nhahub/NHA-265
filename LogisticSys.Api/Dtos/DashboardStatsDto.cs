namespace LogisticSys.Api.Dtos
{
    public class DashboardStatsDto
    {
        public int PendingShipments { get; set; }
        public int InTransitShipments { get; set; }
        public int AvailableDrivers { get; set; }
        public int AvailableVehicles { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}