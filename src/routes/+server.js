export const GET = async ({ request }) => {
    try {
        const res = await fetch('http://localhost:5020/api/Admin/HomePageInfo/GetHomepageInfos');
        if (!res.ok) {
            return new Response('Failed to fetch data', { status: res.status });
        }
        const data = await res.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};