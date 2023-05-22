type DateTimeProps = {
  timestamp: string;
};

function DateTime(props: DateTimeProps) {
  const date = new Date(props.timestamp).toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <>{date}</>;
}

export default DateTime;
