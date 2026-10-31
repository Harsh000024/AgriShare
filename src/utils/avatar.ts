// Avatar utility helpers
// When a user has NOT set a profile picture, avatar should be empty/null,
// displaying initials or a neutral user badge instead of an arbitrary default picture.

export const hasCustomAvatar = (avatar?: string | null): boolean => {
  if (!avatar) return false;
  const trimmed = avatar.trim();
  if (
    trimmed === '' || 
    trimmed === 'default' || 
    trimmed.includes('default-avatar') ||
    trimmed.includes('radialGradient') ||
    trimmed.includes('images.unsplash.com') ||
    trimmed.includes('unsplash.com')
  ) {
    return false;
  }
  return true;
};

export const getUserInitials = (name?: string | null): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
