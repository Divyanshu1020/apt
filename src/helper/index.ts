export const formatRoleName = (roleName: string) => {
    return roleName
      .replace(/^ROLE_/, '') 
      .toLowerCase() 
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };