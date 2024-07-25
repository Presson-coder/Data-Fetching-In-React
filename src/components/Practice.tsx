import { useEffect, useRef, useState } from "react";
import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

interface Post {
  id: number;
  title: string;
}

const Practice = () => {
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      // Abort any existing requests
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const response = await axios.get(`${BASE_URL}/posts?_page=${page}`, {
          signal: abortControllerRef.current.signal,
        });
        setPosts(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request aborted');
          return;
        }
        // Handle the error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>Data Fetching</h1>
      <button onClick={() => setPage(page + 1)}>Increase page ({page})</button>
      {isLoading && <h1>Loading...</h1>}
      {!isLoading && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Practice;
