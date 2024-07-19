import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import React from "react";
/**
 * @brief Acordion encargado de mostrar una de las pregunas mas freucentes
 */
const Question = ({ id, question, answer }) => {
  // variables de estado
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Accordion
      key={id + "-body"}
      sx={{
        width: "100%",
        height: "100%",
        border: `1px solid #999999`,
        "&:not(:last-child)": {
          borderBottom: 0,
        },
        "&::before": {
          display: "none",
        },
      }}
      expanded={expanded === question}
      onChange={handleChange(question)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ background: "rgba(0, 0, 0, .05)" }}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography variant="h6" color={"primary"}>
          {question}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderTop: "1px solid rgba(0, 0, 0, .125)",
          alignItems: "justify",
          justifyContent: "justify",
          textAlign: "justify",
        }}
      >
        {answer.map((line, index) => (
          <Typography
            key={`${question}-line-${index}`}
            variant="body1"
            component="div"
          >
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(line) }}
            />
          </Typography>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default Question;
