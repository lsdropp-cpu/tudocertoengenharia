INSERT INTO public.user_roles (user_id, role)
VALUES ('e1f54771-3c6c-4cd4-8cc7-d58d3971ce37', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;