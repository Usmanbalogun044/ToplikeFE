import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";

const SignupForm = ({
  formData,
  handleChange,
  showPassword,
  setShowPassword,
  acceptedTerms,
  setAcceptedTerms,
  errors,
  isSubmitting,
  isFormValid,
  onSubmit,
}) => {
  return (
    <>
      {/* Signup Form */}
      <form className="space-y-7" onSubmit={onSubmit}>
        {errors.submit && (
          <div className="bg-red-50 border border-red-400/40 rounded-xl p-4 mb-2 text-sm font-medium text-red-700">{errors.submit}</div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="relative sm:col-span-1">
            <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wide text-purple-800 mb-1">Full Name</label>
            <FiUser className="input-icon" />
            <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Jane Creator" className="input-field" />
            {errors.name && (<p className="mt-1 text-xs text-red-500">{errors.name}</p>)}
          </div>
          <div className="relative sm:col-span-1">
            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wide text-purple-800 mb-1">Username</label>
            <FiUser className="input-icon" />
            <input id="username" name="username" type="text" required value={formData.username} onChange={handleChange} placeholder="@handle" className="input-field" />
            {errors.username && (<p className="mt-1 text-xs text-red-500">{errors.username}</p>)}
          </div>
        </div>

        <div className="relative">
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-purple-800 mb-1">Email</label>
          <FiMail className="input-icon" />
          <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" className="input-field" />
          {errors.email && (<p className="mt-1 text-xs text-red-500">{errors.email}</p>)}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="relative sm:col-span-1">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-purple-800 mb-1">Password</label>
            <FiLock className="input-icon" />
            <input id="password" name="password" type={showPassword? 'text':'password'} autoComplete="new-password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="input-field pr-12" />
            <button type="button" onClick={()=>setShowPassword(!showPassword)} className="password-toggle-btn" aria-label={showPassword? 'Hide password':'Show password'}>
              {showPassword? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
            <div className="mt-2 h-1 w-full bg-purple-200/60 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 ${formData.password.length>12?'bg-green-500':formData.password.length>8?'bg-yellow-500':formData.password.length>0?'bg-red-500':'bg-transparent'}`} style={{width:`${Math.min((formData.password.length/12)*100,100)}%`}} />
            </div>
            {errors.password && (<p className="mt-1 text-xs text-red-500">{errors.password}</p>)}
          </div>
          <div className="relative sm:col-span-1">
            <label htmlFor="password_confirmation" className="block text-xs font-semibold uppercase tracking-wide text-purple-800 mb-1">Confirm</label>
            <FiLock className="input-icon" />
            <input id="password_confirmation" name="password_confirmation" type={showPassword? 'text':'password'} required value={formData.password_confirmation} onChange={handleChange} placeholder="Repeat password" className="input-field pr-12" />
            <button type="button" onClick={()=>setShowPassword(!showPassword)} className="password-toggle-btn" aria-label={showPassword? 'Hide password':'Show password'}>
              {showPassword? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
            {errors.password_confirmation && (<p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>)}
          </div>
        </div>

        <div>
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              className="py-2 pl-10 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 
              pr-10"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password_confirmation}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-purple-500/10">
          <input id="terms" name="terms" type="checkbox" checked={acceptedTerms} onChange={()=>setAcceptedTerms(!acceptedTerms)} className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded cursor-pointer" />
          <label htmlFor="terms" className="text-xs leading-relaxed text-purple-900/80">
            I agree to the <a href="#" className="link-soft">Terms of Service</a> and <a href="#" className="link-soft">Privacy Policy</a>.
            {errors.terms && (<p className="mt-1 text-red-500">{errors.terms}</p>)}
          </label>
        </div>

        <div>
          <button type="submit" disabled={!isFormValid() || isSubmitting} className={`btn-brand ${(!isFormValid()||isSubmitting)?'opacity-60 pointer-events-none':''}`}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Create Account'}
          </button>
        </div>

        <div className="text-center text-xs font-medium text-purple-900/70">
          Already have an account? <Link to="/login" className="link-soft">Sign In</Link>
        </div>
      </form>
    </>
  );
};

export default SignupForm;
