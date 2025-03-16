export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // TODO check if the user is authenticated and if he is admin
    return <>{children}</>;
}