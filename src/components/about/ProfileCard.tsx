import { userProfile } from '@/data/profile';

interface ProfileCardProps {
  profile?: {
    name: string;
    title: string;
    avatar: string;
    location: string;
    experience: string;
    email: string;
    interests: string;
    tags: string[];
  };
}

const ProfileCard = ({ profile = userProfile }: ProfileCardProps) => {
  return (
    <div className="animate-slide-in-left">
      <div className="relative">
        <div className="bg-[#748386]/10 rounded-2xl p-8 backdrop-blur-sm border border-[#748386]/20">
          <div className="flex items-start space-x-6 mb-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#748386]/30 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#748386] rounded-full flex items-center justify-center border-3 border-white">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold theme-text mb-1">{profile.name}</h3>
              <p className="text-sm theme-text-muted mb-4">{profile.title}</p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-[#748386] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <div>
                    <div className="text-xs theme-text-muted">Location</div>
                    <div className="text-sm font-medium theme-text">{profile.location}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-[#748386] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <div>
                    <div className="text-xs theme-text-muted">Experience</div>
                    <div className="text-sm font-medium theme-text">{profile.experience}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-[#748386] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <div>
                    <div className="text-xs theme-text-muted">Email</div>
                    <div className="text-sm font-medium theme-text">{profile.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-[#748386] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21h20l-2-3H4l-2 3zM20 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v5h20v-5c0-1.1-.9-2-2-2z" />
                  </svg>
                  <div>
                    <div className="text-xs theme-text-muted">Interests</div>
                    <div className="text-sm font-medium theme-text">{profile.interests}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {profile.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-[#748386]/20 text-[#748386] rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#FF6542] rounded-full opacity-60"></div>
        <div className="absolute -bottom-3 -right-3 w-4 h-4 bg-[#912F40] rounded-full opacity-60"></div>
      </div>
    </div>
  );
};

export default ProfileCard;
