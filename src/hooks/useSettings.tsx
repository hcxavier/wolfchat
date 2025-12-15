import { useState, createContext, useContext, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { availableModels } from '../utils/constants';
import { db } from '../db/dexie';

interface ModalContextType {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

interface ApiKeysContextType {
  openRouterApiKey: string;
  setOpenRouterApiKey: (key: string) => void;
  groqApiKey: string;
  setGroqApiKey: (key: string) => void;
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
}

interface ModelContextType {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
}

interface SettingsActionsContextType {
  saveSettings: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);
const ApiKeysContext = createContext<ApiKeysContextType | null>(null);
const ModelContext = createContext<ModelContextType | null>(null);
const UserContext = createContext<UserContextType | null>(null);
const SettingsActionsContext = createContext<SettingsActionsContextType | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const [openRouterApiKey, setOpenRouterApiKey] = useState<string>('');
  const [groqApiKey, setGroqApiKey] = useState<string>('');
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  
  const [selectedModel, setSelectedModelState] = useState<string>('groq/llama-3.3-70b-versatile');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('default');
  const [userName, setUserName] = useState<string>('Usuário');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await db.settings.toArray();
        const settingsMap = new Map(settings.map(s => [s.key, s.value]));

        if (settingsMap.has('openRouterApiKey')) setOpenRouterApiKey(settingsMap.get('openRouterApiKey'));
        if (settingsMap.has('groqApiKey')) setGroqApiKey(settingsMap.get('groqApiKey'));
        if (settingsMap.has('geminiApiKey')) setGeminiApiKey(settingsMap.get('geminiApiKey'));
        
        if (settingsMap.has('selectedModel')) {
          const savedModel = settingsMap.get('selectedModel');
          if (availableModels.includes(savedModel)) {
            setSelectedModelState(savedModel);
          }
        }
        
        if (settingsMap.has('selectedLanguage')) setSelectedLanguage(settingsMap.get('selectedLanguage'));
        if (settingsMap.has('userName')) setUserName(settingsMap.get('userName'));
      } catch (error) {
        console.error('Failed to load settings from DB:', error);
      }
    };
    loadSettings();
  }, []);

  const saveSettings = useCallback(async () => {
    try {
      await db.settings.bulkPut([
        { key: 'openRouterApiKey', value: openRouterApiKey },
        { key: 'groqApiKey', value: groqApiKey },
        { key: 'geminiApiKey', value: geminiApiKey },
        { key: 'selectedLanguage', value: selectedLanguage },
        { key: 'userName', value: userName }
      ]);
      setShowSettings(false);
    } catch (error) {
      console.error('Failed to save settings to DB:', error);
    }
  }, [openRouterApiKey, groqApiKey, geminiApiKey, selectedLanguage, userName]);

  const setSelectedModel = useCallback((model: string) => {
    setSelectedModelState(model);
    db.settings.put({ key: 'selectedModel', value: model }).catch(err => {
      console.error('Failed to save selectedModel:', err);
    });
  }, []);

  const modalValue = useMemo(() => ({ showSettings, setShowSettings }), [showSettings]);
  
  const apiKeysValue = useMemo(() => ({
    openRouterApiKey, setOpenRouterApiKey,
    groqApiKey, setGroqApiKey,
    geminiApiKey, setGeminiApiKey
  }), [openRouterApiKey, groqApiKey, geminiApiKey]);

  const modelValue = useMemo(() => ({
    selectedModel, setSelectedModel,
    selectedLanguage, setSelectedLanguage
  }), [selectedModel, selectedLanguage, setSelectedModel]);

  const userValue = useMemo(() => ({ userName, setUserName }), [userName]);

  const actionsValue = useMemo(() => ({ saveSettings }), [saveSettings]);

  return (
    <ModalContext.Provider value={modalValue}>
      <ApiKeysContext.Provider value={apiKeysValue}>
        <ModelContext.Provider value={modelValue}>
          <UserContext.Provider value={userValue}>
            <SettingsActionsContext.Provider value={actionsValue}>
              {children}
            </SettingsActionsContext.Provider>
          </UserContext.Provider>
        </ModelContext.Provider>
      </ApiKeysContext.Provider>
    </ModalContext.Provider>
  );
};

export const useSettingsModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useSettingsModal must be used within SettingsProvider');
  return context;
};

export const useApiKeys = () => {
  const context = useContext(ApiKeysContext);
  if (!context) throw new Error('useApiKeys must be used within SettingsProvider');
  return context;
};

export const useModelSettings = () => {
  const context = useContext(ModelContext);
  if (!context) throw new Error('useModelSettings must be used within SettingsProvider');
  return context;
};

export const useUserSettings = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUserSettings must be used within SettingsProvider');
  return context;
};

export const useSettingsActions = () => {
  const context = useContext(SettingsActionsContext);
  if (!context) throw new Error('useSettingsActions must be used within SettingsProvider');
  return context;
};
