import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation("common");

  const switchLanguage = (lng: string) => {
    changeLanguage(lng);
  };

  return (
    <Select onValueChange={(value) => switchLanguage(value)}>
      <SelectTrigger className={cn(className)}>
        <SelectValue
          placeholder={language == "en" ? t("language.en") : t("language.fr")}
        />
      </SelectTrigger>
      <SelectContent defaultValue={language} className="p-1">
        <SelectItem value="fr">{t("language.fr")}</SelectItem>
        <SelectItem value="en">{t("language.en")}</SelectItem>
      </SelectContent>
    </Select>
  );
};
