const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCourses() {
    const res = await fetch(`${BASE_URL}/posts`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
}
