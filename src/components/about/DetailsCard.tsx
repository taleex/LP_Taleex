import { userProfile } from '@/data/profile';

interface DetailsCardProps {
  profile?: {
    description: string[];
  };
}

const DetailsCard = ({ profile = userProfile }: DetailsCardProps) => {
  return (
    <div className="animate-slide-in-right">
      <div className="bg-[#748386]/5 rounded-2xl p-8 backdrop-blur-sm border border-[#748386]/10">
        <div className="space-y-4 theme-text-muted leading-relaxed">
          {profile.description.map((paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsCard;
