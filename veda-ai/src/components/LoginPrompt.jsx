const LoginPrompt = ({ onLogin }) => {
  return (
    <p className="text-sm text-mutedtext">
      Already have an account?{' '}
      <button
        onClick={onLogin}
        className="text-lightgold font-medium hover:text-gold underline underline-offset-4 decoration-gold/40 hover:decoration-gold transition-colors"
      >
        Log in
      </button>
    </p>
  );
};

export default LoginPrompt;
