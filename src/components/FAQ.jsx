import { List, ListItem, Paper, Typography } from "@mui/material";
import React, { lazy, useCallback, useEffect, useState } from "react";
import { usePublicResources } from "../contexts/PublicResourcesContext";
import { useRootFAQString } from "../contexts/TextProvider.jsx";

const Question = lazy(() => import("../fragments/Question.jsx"));

/**
 * @brief Se encarga de renderizar la lista de preguntas frecuentes
 */
const FAQ = () => {
  // Variables de texto
  const rootfaq = useRootFAQString();
  // Servicios del backend
  const { fetch_faq } = usePublicResources();

  // Variables de estado
  const [questions, setQuestions] = useState([]);

  /**
   * @brief Se encarga de obtener las preguntas frecuentes y cargarlas.
   */
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch_faq();
      setQuestions(
        response.map((question) => ({
          ...question,
          isOpen: false, // boolean para saber cual es la pregunta abierta
        }))
      );
    } catch (error) {
      console.error("Error fetching Questions on FAQ: ", error);
    }
  }, [fetch_faq]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * @brief Se encarga de controlar el acordion
   */
  const handleQuestionToggle = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index].isOpen = !updatedQuestions[index].isOpen; // actualiza el booleano
      return updatedQuestions;
    });
  };

  return (
    <Paper>
      <Typography variant="h5" padding={5}>
        {rootfaq.title}
      </Typography>

      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          maxHeight: "100vh",
          "& ul": { padding: 0 },
        }}
      >
        {questions.map((faq, index) => (
          <ListItem key={`${faq.id}-question-item`}>
            <Question
              key={`${faq.id}-question`}
              id={`${faq.id}-question`}
              question={faq.question}
              answer={faq.answers}
              open={faq.isOpen}
              onToggle={() => handleQuestionToggle(index)}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default FAQ;
