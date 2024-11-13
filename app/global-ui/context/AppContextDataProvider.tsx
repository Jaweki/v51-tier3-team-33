"use client";
import {
  ApiResponse,
  Expense,
  User,
  UserContext,
  UserProvider,
} from "@/app/context/UserContext";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect } from "react";

const AppContextData = createContext(null);

const AppContextDataProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const {
    updateUserDetails,
    updateUserContribution,
    updateUserExpenses,
    updateUserGroups,
    updateUserFriends,
  } = useContext(UserContext);

  const { data } = useSession();
  const sessionUserId = data?.user?.id;

  useEffect(() => {
    const getSessionUserFriends = async () => {
      if (!sessionUserId || sessionUserId === "01") return;
      try {
        const response = await fetch(`/api/users?id=${sessionUserId}`);
        if (!response.ok) {
          console.error("Failed to fetch user");
          return;
        }
        const userData = await response.json();
        updateUserDetails(userData.user);
        const sessionUserFriends: string[] = userData.user.friends;

        const result = await fetch(`/api/users`);
        if (!result.ok) {
          console.error("Failed to fetch all users");
          return;
        }

        const allUsersData = await result.json();
        const friendsData = allUsersData.users.filter((user: User) =>
          sessionUserFriends.includes(user._id)
        );
        updateUserFriends(friendsData);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    const getSessionUserGroups = async () => {
      if (!sessionUserId || sessionUserId === "01") return;
      try {
        const response = await fetch("/api/groups");
        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data: ApiResponse = await response.json();
        //filter groups where user is a member
        if (data.success) {
          const sessionUserGroups = sessionUserId
            ? data.groups.filter((group) =>
                group.members.includes(sessionUserId)
              )
            : [];

          updateUserGroups(sessionUserGroups);
        } else {
          console.error("Failed to fetch groups:", data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    const getSessionUserExpenses = async () => {
      if (!sessionUserId || sessionUserId === "01") return;
      try {
        const response = await fetch(
          `/api/users/${sessionUserId}/viewExpenses`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expenses.");
        }
        const { userExpenses } = await response.json();

        //get total contribution
        if (Array.isArray(userExpenses)) {
          const contribution = userExpenses.reduce((acc, currentItem) => {
            return acc + (currentItem.contribution || 0);
          }, 0);
          updateUserContribution(contribution); //lifetime contribution

          //make array of expense ids for easy search
          const userExpensesIds = userExpenses.map(
            (expense) => expense.expense_id
          );

          //get all expenses and find user expenses among them because we need each expense details
          const result = await fetch("/api/expenses");
          if (!result.ok) {
            throw new Error("Failed to fetch all expenses.");
          }
          const { expenses }: { expenses: Expense[] } = await result.json();

          const findUserContributionForCurrentExpense = (id: string) => {
            if (Array.isArray(userExpenses)) {
              const foundExpense = userExpenses.find(
                (expense) => expense.expense_id === id
              );
              return foundExpense ? foundExpense.contribution : undefined;
            }
          };
          const userExpenseDetails: Expense[] = expenses
            .filter((expense) => userExpensesIds.includes(expense._id))
            .map((expense) => {
              return {
                ...expense,
                contribution: findUserContributionForCurrentExpense(
                  expense._id
                ),
              };
            });

          updateUserExpenses(userExpenseDetails);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    getSessionUserFriends();
    getSessionUserGroups();
    getSessionUserExpenses();
  }, [sessionUserId]);

  return (
    <AppContextData.Provider value={null}>
      <UserProvider>{children}</UserProvider>
    </AppContextData.Provider>
  );
};

export default AppContextDataProvider;
