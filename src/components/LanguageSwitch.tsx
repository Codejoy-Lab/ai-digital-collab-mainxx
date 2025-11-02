import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2 hover:bg-primary/10 transition-colors"
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold">
        {language === 'zh' ? 'EN' : '中文'}
      </span>
    </Button>
  );
};
