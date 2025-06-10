import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Language Switcher Test</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Dropdown Variant</h2>
            <LanguageSwitcher variant="dropdown" />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Buttons Variant</h2>
            <LanguageSwitcher variant="buttons" className="justify-center" />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Current URL:</h3>
            <div className="p-3 bg-gray-100 rounded-md text-sm font-mono break-all">
              {typeof window !== 'undefined' ? window.location.href : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
