"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useSession } from "next-auth/react";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

export interface Group {
  _id: string;
  name: string;
  members: string[];
  budget: number;
  description: string;
  expenses: string[];
  invite_link: string;
}

export interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  group_id: string;
  name: string;
  contribution: number;
}

export interface UserContextType {
  userDetails: User;
  userGroups: Group[];
  userFriends: User[];
  userExpenses: Expense[];
  userContribution: number;
  updateUserGroups: (groups: Group[]) => void;
  updateUserFriends: (friends: User[]) => void;
  updateUserExpenses: (expenses: Expense[]) => void;
  updateUserContribution: (amount: number) => void;
  updateUserDetails: (details: User) => void;
}

export interface ApiResponse {
  success: boolean;
  groups: Group[];
}

const defaultUser: User = {
  _id: "01",
  firstName: "Stranger",
  lastName: "",
  email: "No email",
  image: "",
};

export const UserContext = createContext<UserContextType>({
  userDetails: {} as User,
  userGroups: [] as Group[],
  userFriends: [] as User[],
  userExpenses: [] as Expense[],
  userContribution: 0 as number,
  updateUserGroups: (groups: Group[]) => {},
  updateUserFriends: (friends: User[]) => {},
  updateUserExpenses: (expenses: Expense[]) => {},
  updateUserContribution: (amount: number) => {},
  updateUserDetails: (details: User) => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userDetails, setUserDetails] = useState<User>(defaultUser);
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [userFriends, setUserFriends] = useState<User[]>([]);
  const [userExpenses, setUserExpenses] = useState<Expense[]>([]);
  const [userContribution, setUserContribution] = useState<number>(0);

  // const { data } = useSession();
  // const sessionUserId = data?.user?.id;

  // useEffect(() => {
  //   const getSessionUserFriends = async () => {
  //     if (!sessionUserId || sessionUserId === "01") return;
  //     try {
  //       const response = await fetch(`/api/users?id=${sessionUserId}`);
  //       if (!response.ok) {
  //         console.error("Failed to fetch user");
  //         return;
  //       }
  //       const userData = await response.json();
  //       setUserDetails(userData.user);
  //       const sessionUserFriends: string[] = userData.user.friends;

  //       const result = await fetch(`/api/users`);
  //       if (!result.ok) {
  //         console.error("Failed to fetch all users");
  //         return;
  //       }

  //       const allUsersData = await result.json();
  //       const friendsData = allUsersData.users.filter((user: User) =>
  //         sessionUserFriends.includes(user._id)
  //       );
  //       setUserFriends(friendsData);
  //     } catch (error) {
  //       console.error("Error fetching friends:", error);
  //     }
  //   };

  //   const getSessionUserGroups = async () => {
  //     if (!sessionUserId || sessionUserId === "01") return;
  //     try {
  //       const response = await fetch("/api/groups");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch groups");
  //       }
  //       const data: ApiResponse = await response.json();
  //       //filter groups where user is a member
  //       if (data.success) {
  //         const sessionUserGroups = sessionUserId
  //           ? data.groups.filter((group) =>
  //               group.members.includes(sessionUserId)
  //             )
  //           : [];

  //         setUserGroups(sessionUserGroups);
  //       } else {
  //         console.error("Failed to fetch groups:", data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching groups:", error);
  //     }
  //   };

  //   const getSessionUserExpenses = async () => {
  //     if (!sessionUserId || sessionUserId === "01") return;
  //     try {
  //       const response = await fetch(
  //         `/api/users/${sessionUserId}/viewExpenses`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch expenses.");
  //       }
  //       const { userExpenses } = await response.json();

  //       //get total contribution
  //       if (Array.isArray(userExpenses)) {
  //         const contribution = userExpenses.reduce((acc, currentItem) => {
  //           return acc + (currentItem.contribution || 0);
  //         }, 0);
  //         setUserContribution(contribution); //lifetime contribution

  //         //make array of expense ids for easy search
  //         const userExpensesIds = userExpenses.map(
  //           (expense) => expense.expense_id
  //         );

  //         //get all expenses and find user expenses among them because we need each expense details
  //         const result = await fetch("/api/expenses");
  //         if (!result.ok) {
  //           throw new Error("Failed to fetch all expenses.");
  //         }
  //         const { expenses }: { expenses: Expense[] } = await result.json();

  //         const findUserContributionForCurrentExpense = (id: string) => {
  //           if (Array.isArray(userExpenses)) {
  //             const foundExpense = userExpenses.find(
  //               (expense) => expense.expense_id === id
  //             );
  //             return foundExpense ? foundExpense.contribution : undefined;
  //           }
  //         };
  //         const userExpenseDetails: Expense[] = expenses
  //           .filter((expense) => userExpensesIds.includes(expense._id))
  //           .map((expense) => {
  //             return {
  //               ...expense,
  //               contribution: findUserContributionForCurrentExpense(
  //                 expense._id
  //               ),
  //             };
  //           });

  //         setUserExpenses(userExpenseDetails);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching expenses:", error);
  //     }
  //   };

  //   getSessionUserFriends();
  //   getSessionUserGroups();
  //   getSessionUserExpenses();
  // }, [sessionUserId]);

  const contextValues = useMemo(() => {
    const updateUserDetails = (details: User) => {
      setUserDetails(details);
    };
    const updateUserGroups = (groups: Group[]) => {
      setUserGroups([...groups]);
    };
    const updateUserFriends = (friends: User[]) => {
      setUserFriends([...friends]);
    };
    const updateUserExpenses = (expenses: Expense[]) => {
      setUserExpenses([...expenses]);
    };
    const updateUserContribution = (amount: number) => {
      setUserContribution(amount);
    };

    return {
      userDetails,
      userGroups,
      userFriends,
      userExpenses,
      userContribution,
      updateUserGroups,
      updateUserFriends,
      updateUserExpenses,
      updateUserContribution,
      updateUserDetails,
    };
  }, [userDetails, userGroups, userFriends, userExpenses, userContribution]);

  return (
    <UserContext.Provider value={contextValues}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
