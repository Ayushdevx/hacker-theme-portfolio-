import MatrixRain from './components/MatrixRain';
import HackerTerminal from './components/HackerTerminal';
import SystemInfo from './components/SystemInfo';
import NetworkScanner from './components/NetworkScanner';
import FileExplorer from './components/FileExplorer';
import PasswordCracker from './components/PasswordCracker';
import EncryptionTool from './components/EncryptionTool';
import HackerProfile from './components/HackerProfile';
import ThemeSwitcher from './components/ThemeSwitcher';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-green-500 p-8 relative">
      <MatrixRain />
      <ThemeSwitcher />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <HackerProfile />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <HackerTerminal />
          <SystemInfo />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <NetworkScanner />
          <FileExplorer />
          <PasswordCracker />
        </div>
        
        <EncryptionTool />
      </div>
    </main>
  );
}
