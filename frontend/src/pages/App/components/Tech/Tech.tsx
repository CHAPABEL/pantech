import { useState } from "react";
import styles from "./Tech.module.scss";

const techData = [
  {
    id: 1,
    title: "Analysis/PM",
    content: [
      "UML / IDEF / BPMN / DFD / ERD ",
      "SQL / Rest / Soap / XML / XSD / ГОСТ 34, 19",
      "JSON / SQL",
      "Atlassian JIRA, Confluence, MS Project",
      "Agile / Scrum",
      "Составление вариантов использования ПО",
      "Функциональные и нефункциональные требования к ПО",
      "Написание Технического задания",
    ],
  },
  {
    id: 2,
    title: "Frontend",
    content: [
      "React",
      "Figma",
      "Redux",
      "TypeScript",
      "JavaScript",
      "Angular",
      "Vue",
      "Node.js",
      "TypeORM",
    ],
  },
  {
    id: 3,
    title: "Backend",
    content: [
      "Java Core / JDBC",
      "C#",
      "C++",
      "Apache Kafka / RabbitMQ / IBM MQ",
      "Python",
      "Go",
      "MySQL, PostgreSQL, MS SQL",
      "Kubernetes",
      "Docker, Docker Compose",
    ],
  },
  {
    id: 4,
    title: "Databases",
    content: [
      "Redis",
      "MongoDB",
      "Neo4J",
      "Oracle",
      "Hadoop",
      "MySQL, PostgreSQL, MS SQL",
    ],
  },
  {
    id: 5,
    title: "DevOps/SRE/Support",
    content: [
      "ELK",
      "Docker",
      "CI/CD",
      "K8S",
      "Ansible",
      "Terraform",
      "Nginx",
      "Proxmox",
      "Python",
    ],
  },
  {
    id: 6,
    title: "Machine learning",
    content: [
      "TensorFlow",
      "Theano",
      "Apache Spark",
      "PyTorch",
      "Python",
      "Scikit-learn",
      "Keras",
    ],
  },
];

function Tech() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [fade, setFade] = useState<boolean>(true);

  const handleClick = (id: number) => {
    setFade(false);
    setTimeout(() => {
      setSelectedId(id);
      setFade(true);
    }, 200);
  };

  const selectedData = techData.find((item) => item.id === selectedId);

  return (
    <div className={styles.tech_container}>
      <div className={styles.container_buttons}>
        {techData.map((item) => (
          <button
            key={item.id}
            className={`${styles.buttons_btn} ${
              selectedId === item.id ? styles.active : ""
            }`}
            onClick={() => handleClick(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className={styles.container_info}>
        <span
          className={`${styles.info_mnText} ${
            fade ? styles.fadeIn : styles.fadeOut
          }`}
        >
          {selectedData?.title}
        </span>
        <div
          className={`${styles.info_list} ${
            fade ? styles.fadeIn : styles.fadeOut
          }`}
        >
          {selectedData?.content.map((tech, index) => (
            <span key={index} className={styles.list_key}>
              {"• " + tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tech;
