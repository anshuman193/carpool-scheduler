-- Core relational schema for production migration planning.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  given_name TEXT,
  family_name TEXT,
  picture_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE families (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE children (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL REFERENCES families(id),
  name TEXT NOT NULL,
  grade TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carpool_groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  route_from TEXT NOT NULL,
  route_to TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_memberships (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES carpool_groups(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(group_id, user_id, role)
);

CREATE TABLE ride_slots (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES carpool_groups(id),
  ride_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  route_from TEXT NOT NULL,
  route_to TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assignments (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES carpool_groups(id),
  ride_slot_id TEXT NOT NULL REFERENCES ride_slots(id),
  driver_user_id TEXT NOT NULL REFERENCES users(id),
  rider_ids JSON NOT NULL,
  conflict_reasons JSON NOT NULL,
  fairness_score INTEGER NOT NULL DEFAULT 0,
  manual_override BOOLEAN NOT NULL DEFAULT FALSE,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE swap_requests (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES carpool_groups(id),
  assignment_id TEXT NOT NULL REFERENCES assignments(id),
  requested_by_user_id TEXT NOT NULL REFERENCES users(id),
  requested_to_user_id TEXT REFERENCES users(id),
  reason TEXT,
  status TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_threads (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES carpool_groups(id),
  title TEXT NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL REFERENCES chat_threads(id),
  sender_id TEXT NOT NULL REFERENCES users(id),
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  delivery_status TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT REFERENCES users(id),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_group_memberships_group_user ON group_memberships(group_id, user_id);
CREATE INDEX idx_ride_slots_group_date ON ride_slots(group_id, ride_date);
CREATE INDEX idx_assignments_group_slot ON assignments(group_id, ride_slot_id);
CREATE INDEX idx_swap_requests_group_status ON swap_requests(group_id, status);
CREATE INDEX idx_notifications_user_created_at ON notifications(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity_created_at ON audit_logs(entity_type, entity_id, created_at DESC);
