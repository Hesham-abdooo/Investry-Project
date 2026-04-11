import React from 'react'
export default function LoginDivider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-sm">Or continue with</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}