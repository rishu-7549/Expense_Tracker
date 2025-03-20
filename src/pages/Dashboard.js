import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import AddIncomeModal from '../components/Modals/addIncome';
import AddExpenseModal from '../components/Modals/addExpense';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import TranscationsTable from '../components/TranscationsTable';
import ChartComponent from '../components/charts';
import NoTranscation from '../components/noTranscation';



function Dashboard() {

  // const transcations = [
  //   {
  //     type: "income",
  //     amount: 1200,
  //     tag: 'salary',
  //     name: "income 1",
  //     date: "2023-05-23"
  //   },

  //   {
  //     type: "expense",
  //     amount: 700,
  //     tag: 'food',
  //     name: "expense 1",
  //     date: "2023-05-17"
  //   },
  // ]

  const [transcations, setTransctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);


  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }

  const onFinish = (values, type) => {
    const newTranscation = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTranscation(newTranscation)
  }

  async function addTranscation(transcation) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transcations`),
        transcation
      );
      console.log("Documnet written with ID", docRef.id);
      toast.success("Transcation Added !!");
      let newArr = transcations;
      newArr.push(transcation);
      setTransctions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document", e);
      toast.error("Couldn't add transcation");
    }
  }

  useEffect(() => {
    fetchTranscations();
  }, [user]);



  useEffect(() => {
    calculateBalance();
  }, [transcations])

  function calculateBalance() {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transcations.forEach((transcation) => {
      if (transcation.type === "income") {
        incomeTotal += transcation.amount;
      }
      else {
        expenseTotal += transcation.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }

  async function fetchTranscations() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transcations`));
      const querySnapshot = await getDocs(q);
      let transcationsArray = [];
      querySnapshot.forEach((doc) => {
        transcationsArray.push(doc.data());
      });
      setTransctions(transcationsArray);
      toast.success("Transcation Fetched !!");
    }
    setLoading(false);
  }


  let sortedTranscations = [...transcations].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });


  return (
    <div>
      <Header />
      <>
        <Cards

          income={income}
          expense={expense}
          totalBalance={totalBalance}
          showExpenseModal={showExpenseModal}
          showIncomeModal={showIncomeModal}
        />

        {transcations.length !== 0 ? <ChartComponent sortedTranscations={sortedTranscations} /> : <NoTranscation />}

        <AddIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handleIncomeCancel={handleIncomeCancel}
          onFinish={onFinish} />

        <AddExpenseModal
          isExpenseModalVisible={isExpenseModalVisible}
          handleExpenseCancel={handleExpenseCancel}
          onFinish={onFinish} />

        <TranscationsTable transcations={transcations} addTranscation={addTranscation} />
      </>

    </div>
  )
}

export default Dashboard
