type EntityTextProps = {
  title: string;
  description: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

function EntityText({
  title,
  description,
  titleClassName,
  descriptionClassName,
}: EntityTextProps) {
  return (
    <>
      <span className={titleClassName}>{title}</span>
      <span className={descriptionClassName}>{description}</span>
    </>
  );
}

export default EntityText;
