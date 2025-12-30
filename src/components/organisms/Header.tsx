import { Menu, Sparkles } from 'lucide-react';
import { ModelSelector } from '../molecules/ModelSelector';
import { IconButton, Switch } from '../atoms/Buttons';
import { memo, useCallback, useMemo } from 'react';
import { useModelSettings } from '../../hooks/useSettings';
import { WolfLogo } from '../atoms/WolfLogo';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isImmersive: boolean;
  setIsImmersive: (isImmersive: boolean) => void;

}

const MenuIcon = <Menu size={20} />;

export const Header = memo(({ isSidebarOpen, setIsSidebarOpen, isImmersive, setIsImmersive }: HeaderProps) => {
  const { selectedModel, setSelectedModel } = useModelSettings();

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen, setIsSidebarOpen]);

  const handleSelectModel = useCallback((model: string) => {
    setSelectedModel(model);
  }, [setSelectedModel]);

  const containerClassName = useMemo(() => 
    `flex items-center gap-1.5 sm:gap-3 transition-opacity duration-300 opacity-100`,
    []
  );

  return (
    <header className="h-16 flex items-center justify-between px-3 sm:px-4 bg-surface-main/80 border-b border-primary/5 fixed top-0 left-0 right-0 z-10 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="lg:hidden">
          <IconButton
            aria-label="Toggle Sidebar"
            icon={MenuIcon}
            onClick={handleToggleSidebar}
            className="p-2"
          />
        </div>
        <div className="hidden @[300px]:flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20 lg:hidden shrink-0">
              <WolfLogo className="w-4 h-4 text-white" />
           </div>
           <span className="hidden sm:block lg:hidden font-bold text-primary tracking-tight">WolfChat</span>
        </div>
      </div>

      <div className={containerClassName}>
        <div 
          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-full transition-all duration-300 group cursor-pointer ${
            isImmersive 
              ? 'bg-brand-500/10 border-brand-500/50 shadow-[0_0_15px_rgba(255,20,87,0.2)]' 
              : 'bg-primary/5 border-primary/10 hover:bg-primary/10'
          }`}
          onClick={() => setIsImmersive(!isImmersive)}
        >
            <Sparkles size={14} className={isImmersive ? "text-brand-500" : "text-primary/30 group-hover:text-primary/50"} />
            <span className={`text-[11px] font-bold tracking-tight transition-colors ${isImmersive ? 'text-brand-500' : 'text-primary/40'}`}>
              IMERSIVO
            </span>
            <Switch 
                checked={isImmersive} 
                onChange={setIsImmersive} 
                className="hidden sm:inline-flex scale-[0.65] -mr-2 h-5 w-9 shrink-0" 
            />
        </div>

        <ModelSelector 
            selectedModel={selectedModel} 
            onSelectModel={handleSelectModel} 
        />
      </div>
    </header>
  );
});