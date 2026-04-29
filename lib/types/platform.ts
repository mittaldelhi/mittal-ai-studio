export type UserRole = "customer" | "support" | "admin";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  role: UserRole;
  created_at: string;
};

export type BusinessProfile = {
  id: string;
  user_id: string;
  business_name: string | null;
  business_type: string | null;
  address: string | null;
  city: string | null;
  service_interest: string | null;
  created_at: string;
};

export type Enquiry = {
  id: string;
  user_id: string | null;
  name: string;
  business: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  razorpay_order_id: string | null;
  status: string;
  created_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  order_id: string | null;
  plan_name: string;
  amount: number;
  currency: string;
  razorpay_payment_id: string | null;
  status: string;
  created_at: string;
};

export type SupportThread = {
  id: string;
  user_id: string;
  subject: string;
  status: string;
  created_at: string;
};

export type SupportMessage = {
  id: string;
  thread_id: string;
  user_id: string | null;
  sender_role: UserRole;
  message: string;
  created_at: string;
};

export type Complaint = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: string;
  admin_response: string | null;
  created_at: string;
};

export type ReviewRequest = {
  id: string;
  user_id: string;
  service_name: string;
  message: string;
  status: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  user_id: string | null;
  rating: number;
  message: string;
  created_at: string;
};

export type AnalyticsEvent = {
  id: string;
  user_id: string | null;
  event_name: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type PortfolioProjectRecord = {
  id: string;
  title: string;
  client_name: string;
  category: string;
  city: string | null;
  live_url: string;
  description: string;
  result: string;
  tags: string[];
  services_delivered: string[];
  image_url: string | null;
  active: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
};

export type SiteSetting = {
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
