import { authorize } from './Spotify';

function LoginPage() {
 
  const handleClick = () => {
      authorize();
  }
  return (
    <div>
      <h1>Login with Spotify</h1>
      <button onClick={handleClick}>Authorize with Spotify</button>
    </div>
  );
}

export default LoginPage;