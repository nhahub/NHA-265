import React, { useState, useEffect } from 'react';
import { 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  CircularProgress, 
  Typography,
  ListItemIcon
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useRouter } from 'next/router';

interface NotificationDto {
  notificationId: number;
  message: string;
  status: string;
  createdAt: string;
}

const API_URL = 'https://localhost:7106';

const NotificationBell = () => {
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const fetchNotifications = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    const headers = { 'Authorization': `Bearer ${token}` };
    
    try {
      const response = await fetch(`${API_URL}/api/notifications/my`, { headers });
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data: NotificationDto[] = await response.json();
      setNotifications(data);
      setUnreadCount(data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications(); 
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      await fetch(`${API_URL}/api/notifications/${id}/mark-as-read`, {
        method: 'POST',
        headers: headers,
      });
      
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        PaperProps={{
            style: {
              maxHeight: 400,
              width: '350px',
            },
        }}
      >
        {loading ? (
          <MenuItem><CircularProgress size={20} /></MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem onClick={handleClose}>No new notifications</MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem key={notif.notificationId} onClick={() => handleMarkAsRead(notif.notificationId)}>
              <ListItemIcon>
                <MarkEmailReadIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2" style={{ whiteSpace: 'normal' }}>
                {notif.message}
                <br />
                <Typography variant="caption" color="textSecondary">
                  {notif.createdAt}
                </Typography>
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;