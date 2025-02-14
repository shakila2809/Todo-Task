import React from 'react'

export interface User {
    data: number;
    getUserData: () => void;
    username: string;
  password: string;
}


export const getUserData = async (url: string): Promise<User[]> => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: User[] = await response.json();  // Cast the response to User[] (an array of users)
    return data;
  };