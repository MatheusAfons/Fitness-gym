// Usuários
export const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]')
export const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users))
export const findUserByEmail = (email) =>getUsers().find((u) => u.email === email)

// Sessão
export const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser') || 'null')
export const saveCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user))
export const clearCurrentUser = () => localStorage.removeItem('currentUser')

// Atividades
export const getActivities = (userId) => JSON.parse(localStorage.getItem(`activities_${userId}`) || '[]')
export const saveActivities = (userId, activities) => localStorage.setItem(`activities_${userId}`, JSON.stringify(activities))

// Metas
export const getMetas = (userId) => JSON.parse(localStorage.getItem(`metas_${userId}`) || '[]')
export const saveMetas = (userId, metas) => localStorage.setItem(`metas_${userId}`, JSON.stringify(metas))