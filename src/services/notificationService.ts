import Pusher from 'pusher-js';
import axios from 'axios';
import { DepositNotification } from '../types';
import dotenv from 'dotenv';

dotenv.config();

export class NotificationService {
  private pusherClient: Pusher | null = null;
  private token: string | null = null;
  private organizationId: string | null = null;
  private depositCallback: ((data: DepositNotification) => void) | null = null;

  constructor() {
    // Pusher initialization is deferred until setup is called
  }

  // Setup the notification service with authentication
  async setup(token: string, organizationId: string, onDeposit: (data: DepositNotification) => void): Promise<void> {
    this.token = token;
    this.organizationId = organizationId;
    this.depositCallback = onDeposit;

    // Initialize Pusher client with authentication
    this.pusherClient = new Pusher(process.env.PUSHER_KEY || '', {
      cluster: process.env.PUSHER_CLUSTER || '',
      authorizer: (channel) => ({
        authorize: async (socketId, callback) => {
          try {
            const response = await axios.post('/api/notifications/auth', {
              socket_id: socketId,
              channel_name: channel.name
            }, {
              headers: {
                Authorization: `Bearer ${this.token}`
              },
              baseURL: process.env.API_BASE_URL
            });

            if (response.data) {
              callback(null, response.data);
            } else {
              callback(new Error('Pusher authentication failed'), null);
            }
          } catch (error) {
            console.error('Pusher authorization error:', error);
            callback(error as Error, null);
          }
        }
      })
    });

    // Subscribe to organization's private channel
    const channelName = `private-org-${this.organizationId}`;
    const channel = this.pusherClient.subscribe(channelName);

    // Handle subscription events
    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Successfully subscribed to Pusher channel:', channelName);
    });

    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('Pusher subscription error:', error);
    });

    // Bind to the deposit event
    channel.bind('deposit', (data: DepositNotification) => {
      if (this.depositCallback) {
        this.depositCallback(data);
      }
    });
  }

  // Disconnect the notification service
  disconnect(): void {
    if (this.pusherClient) {
      if (this.organizationId) {
        this.pusherClient.unsubscribe(`private-org-${this.organizationId}`);
      }
      this.pusherClient.disconnect();
      this.pusherClient = null;
    }
    this.token = null;
    this.organizationId = null;
    this.depositCallback = null;
  }

  // Check if the notification service is connected
  isConnected(): boolean {
    return !!this.pusherClient && !!this.token && !!this.organizationId;
  }
}

export default new NotificationService(); 