import { createContext, useContext, useState } from 'react';

type ContextType = {
  idUser: string
  changeIdUser: (v: string) => void;
  name: string
  changeName: (v: string) => void;
  type: string
  changeType: (v: string) => void;
  username: string
  changeUsername: (v: string) => void;
  date: string
  changeDate: (v: string) => void;
}

const Context = createContext<ContextType | undefined>(undefined);

export const MyContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error('MyContext debe usarse dentro de un Provider');
  return context;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [idUser, setIdUser] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const changeIdUser = (newIdUser: string) => {
    setIdUser(newIdUser);
    localStorage.setItem('idUser', newIdUser);
  }

  const changeName = (newName: string) => {
    setName(newName);
    localStorage.setItem('name', newName);
  }

  const changeType = (newType: string) => {
    setType(newType);
    localStorage.setItem('type', newType);
  }

  const changeUsername = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('username', newUsername);
  }

  const changeDate = (newDate: string) => {
    setDate(newDate);
    localStorage.setItem('date', newDate);
  }

  return (
    <Context.Provider value={{
      idUser,
      changeIdUser,
      name,
      changeName,
      type,
      changeType,
      username,
      changeUsername,
      date,
      changeDate,
    }}>
      {children}
    </Context.Provider>
  );
};
