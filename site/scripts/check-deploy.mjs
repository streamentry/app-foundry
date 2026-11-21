const email = process.env.PUBLIC_SUPPORT_EMAIL?.trim();

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error(
    'Refusing production deploy. Set PUBLIC_SUPPORT_EMAIL to the verified public privacy and support contact first.',
  );
  process.exit(1);
}
