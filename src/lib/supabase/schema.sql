-- Enable UUID extension
create extension if not exists "uuid-ossp" with schema extensions;

-- Users and Authentication
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('admin', 'editor', 'user')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Destinations
create table if not exists public.destinations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  featured_image text,
  gallery text[],
  meta_title text,
  meta_description text,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tour Categories
create table if not exists public.tour_categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tours
create table if not exists public.tours (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text not null,
  overview jsonb,
  highlights text[],
  included text[],
  excluded text[],
  duration_days integer not null,
  duration_nights integer,
  min_people integer default 1,
  max_people integer,
  difficulty_level text check (difficulty_level in ('Easy', 'Moderate', 'Challenging', 'Difficult')),
  destination_id uuid references public.destinations(id) on delete set null,
  category_id uuid references public.tour_categories(id) on delete set null,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tour Pricing
create table if not exists public.tour_pricing (
  id uuid default uuid_generate_v4() primary key,
  tour_id uuid references public.tours(id) on delete cascade not null,
  name text not null,
  description text,
  price_per_person decimal(10, 2) not null,
  min_people integer default 1,
  max_people integer,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tour Availability
create table if not exists public.tour_availability (
  id uuid default uuid_generate_v4() primary key,
  tour_id uuid references public.tours(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'available' check (status in ('available', 'limited', 'booked')),
  max_capacity integer,
  current_bookings integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_dates check (end_date >= start_date)
);

-- Tour Itinerary
create table if not exists public.tour_itinerary (
  id uuid default uuid_generate_v4() primary key,
  tour_id uuid references public.tours(id) on delete cascade not null,
  day_number integer not null,
  title text not null,
  description text not null,
  accommodation text,
  meals text[],
  activities text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tour Gallery
create table if not exists public.tour_gallery (
  id uuid default uuid_generate_v4() primary key,
  tour_id uuid references public.tours(id) on delete cascade not null,
  image_url text not null,
  caption text,
  is_featured boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bookings
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  tour_id uuid references public.tours(id) on delete set null,
  pricing_id uuid references public.tour_pricing(id) on delete set null,
  availability_id uuid references public.tour_availability(id) on delete set null,
  booking_number text unique not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  start_date date not null,
  end_date date not null,
  number_of_people integer not null,
  total_amount decimal(10, 2) not null,
  currency text default 'USD',
  special_requests text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'partial', 'paid', 'refunded', 'failed')),
  payment_method text,
  payment_reference text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Booking Guests
create table if not exists public.booking_guests (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  date_of_birth date,
  passport_number text,
  nationality text,
  dietary_requirements text,
  medical_conditions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  amount decimal(10, 2) not null,
  currency text default 'USD',
  payment_method text not null,
  transaction_id text,
  status text not null check (status in ('pending', 'completed', 'failed', 'refunded')),
  payment_date timestamp with time zone,
  receipt_url text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Favorites
create table if not exists public.user_favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tour_id uuid references public.tours(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_tour unique(user_id, tour_id)
);

-- Reviews
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  tour_id uuid references public.tours(id) on delete cascade not null,
  booking_id uuid references public.bookings(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  comment text,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Notifications
create table if not exists public.user_notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text not null check (type in ('booking', 'payment', 'system', 'promotion')),
  is_read boolean default false,
  link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better performance
create index idx_tours_destination on public.tours(destination_id);
create index idx_tours_category on public.tours(category_id);
create index idx_tour_pricing_tour on public.tour_pricing(tour_id);
create index idx_tour_availability_tour on public.tour_availability(tour_id);
create index idx_tour_itinerary_tour on public.tour_itinerary(tour_id);
create index idx_tour_gallery_tour on public.tour_gallery(tour_id);
create index idx_bookings_user on public.bookings(user_id);
create index idx_bookings_tour on public.bookings(tour_id);
create index idx_booking_guests_booking on public.booking_guests(booking_id);
create index idx_payments_booking on public.payments(booking_id);
create index idx_user_favorites_user on public.user_favorites(user_id);
create index idx_reviews_tour on public.reviews(tour_id);
create index idx_reviews_user on public.reviews(user_id);
create index idx_user_notifications_user on public.user_notifications(user_id);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.tour_categories enable row level security;
alter table public.tours enable row level security;
alter table public.tour_pricing enable row level security;
alter table public.tour_availability enable row level security;
alter table public.tour_itinerary enable row level security;
alter table public.tour_gallery enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_guests enable row level security;
alter table public.payments enable row level security;
alter table public.user_favorites enable row level security;
alter table public.reviews enable row level security;
alter table public.user_notifications enable row level security;

-- Create RLS policies
-- Profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Tours (public read, admin/editor write)
create policy "Tours are viewable by everyone"
  on public.tours for select
  using (true);

create policy "Enable insert for authenticated users only"
  on public.tours for insert
  with check (auth.role() = 'authenticated' and (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor'))
  ));

-- Bookings (users can only see their own bookings)
create policy "Users can view their own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

-- Similar policies for other tables...

-- Create a function to handle new user signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to handle new user signups
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a function to get user role
create or replace function public.get_user_role()
returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer;
