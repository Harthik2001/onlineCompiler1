// client/src/components/Auth/GoogleLogin.js
const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
      window.location.href = 'http://localhost:5000/api/auth/google';
    };
  
    return (
      <button onClick={handleGoogleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Login with Google
      </button>
    );
  };
  export default GoogleLoginButton;