import React, { useState } from "react";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "hooks/useVisualMode";

import "components/Appointment/styles.scss";

const EMPTY = "EMPTY";
const SAVING = "SAVING";
const DELETING = "DELETING";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const CONFIRM = "CONFIRM";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  const save = (name, interviewer, type) => {
    const interview = {
      student: name,
      interviewer
    }

    transition(SAVING);

    props.bookInterview(props.id, interview, type)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  }

  const edit = () => {
    transition(EDIT);
  }

  const confirm = () => {
    transition(CONFIRM);
  }

  const cancel = () => {
    transition(DELETING, true);

    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  }

  return (
    <article className="appointment">
      <header>{props.time}</header>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === ERROR_SAVE && <Error message="Could not save appointment" onClose={back} />}
      {mode === ERROR_DELETE && <Error message="Could not delete appointment" onClose={back} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student} 
          interviewer={props.interview.interviewer.name}
          onDelete={confirm}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form
          type={CREATE}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === EDIT && (
        <Form
          type={EDIT}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete?"
          onConfirm={cancel}
          onCancel={back}
        />
      )}
    </article>
  );
}