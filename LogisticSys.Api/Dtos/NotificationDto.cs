namespace LogisticSys.Api.Dtos
{
    public class NotificationDto
    {
        public int NotificationId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }
}