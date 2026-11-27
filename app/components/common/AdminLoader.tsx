// CMS loading spinner (bars styled by .loader in globals.css). Used by the route loading screen ((auth)/loading.tsx)
// and by pages that wait for their data before showing the form, so every CMS page shows the same spinner.
const AdminLoader = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="loader">
            {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className={`bar${i + 1}`}></div>
            ))}
        </div>
    </div>
);

export default AdminLoader;
