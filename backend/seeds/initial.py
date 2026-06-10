"""Initial seed: lifts the current frontend hardcoded content into the DB.

Idempotent: only inserts rows that don't already exist (matched by key for
content and by title for cards/services/projects).

Run inside the backend container/venv:

    python -m seeds.initial
"""
from __future__ import annotations

import asyncio
import json
from typing import Any

from sqlalchemy import select

from db import AsyncSessionLocal
from models import Card, Content, ContentValueType, Partner, Project, Service


CONTENT_SEED: list[tuple[str, str, ContentValueType]] = [
    ("hero.title.pan", "Pan", ContentValueType.TEXT),
    ("hero.title.tech", "-Tech", ContentValueType.TEXT),
    ("hero.slogan", "Интегратор — это про доверие!", ContentValueType.TEXT),
    (
        "hero.description",
        "Мы делаем ставку на компетенции своих сотрудников и высокое качество работы. "
        "Команда компании решает задачи любого масштаба для наших заказчиков.",
        ContentValueType.TEXT,
    ),
    ("section.products.title", "Наши продукты", ContentValueType.TEXT),
    ("section.services.title", "Наши услуги", ContentValueType.TEXT),
    ("section.projects.title", "Наши проекты", ContentValueType.TEXT),
    ("section.tech.title", "Технологии", ContentValueType.TEXT),
    ("section.partners.title", "Партнеры", ContentValueType.TEXT),
    ("header.contact_btn", "Связаться с нами", ContentValueType.TEXT),
    ("header.email", "info@pan-tech.ru", ContentValueType.TEXT),
    ("footer.contacts.title", "Контакты", ContentValueType.TEXT),
    ("footer.contacts.phone", "+7 (495) 211-00-07", ContentValueType.TEXT),
    ("footer.contacts.email", "info@pan-tech.ru", ContentValueType.TEXT),
    ("footer.address.title", "Адрес", ContentValueType.TEXT),
    (
        "footer.address.value",
        "123100, г. Москва, ул. Мантулинская, дом 16, помещение 2Ц",
        ContentValueType.TEXT,
    ),
    (
        "footer.copyright",
        "© 2025г. Политика конфиденциальности ООО «ВСЕ ТЕХНОЛОГИИ» ИНН 9703209450 ОГРН 1257700165250",
        ContentValueType.TEXT,
    ),
    ("popup_send.title", "Написать нам", ContentValueType.TEXT),
    (
        "popup_send.description",
        "Оставьте контакты, чтобы могли обсудить проект и условия сотрудничества",
        ContentValueType.TEXT,
    ),
    (
        "popup_send.consent",
        "Я согласен(а) на обработку персональных данных",
        ContentValueType.TEXT,
    ),
    ("popup_send.submit", "Отправить", ContentValueType.TEXT),
    (
        "popup_send.success.title",
        "Спасибо! Ваша заявка отправлена",
        ContentValueType.TEXT,
    ),
    (
        "popup_send.success.text",
        "Мы свяжемся с вами в рабочее время",
        ContentValueType.TEXT,
    ),
    ("popup_project.pichta.title", "Pichta", ContentValueType.TEXT),
    (
        "popup_project.pichta.description",
        "Система построения индивидуальной траектории развития специалиста, "
        "которая помогает студентам понять, какие навыки у них уже есть, а какие "
        "необходимо развить для достижения профессиональных целей.",
        ContentValueType.TEXT,
    ),
    (
        "popup_project.pichta.task",
        "Упростить процесс составления индивидуальной образовательной траектории "
        "и помочь пользователям соответствовать требованиям современного рынка труда.",
        ContentValueType.TEXT,
    ),
    (
        "popup_project.pichta.realization",
        "Система использует данные с платформ, таких как hh.ru, чтобы сравнивать "
        "навыки пользователей с актуальными требованиями работодателей.",
        ContentValueType.TEXT,
    ),
    (
        "popup_project.pichta.tech",
        json.dumps(["Python", "Docker", "FastAPI", "Графы"], ensure_ascii=False),
        ContentValueType.JSON,
    ),
    (
        "tech.groups",
        json.dumps(
            [
                {
                    "id": 1,
                    "title": "Analysis/PM",
                    "content": [
                        "UML / IDEF / BPMN / DFD / ERD",
                        "SQL / REST / SOAP / XML / XSD / ГОСТ 34, 19",
                        "JSON / SQL",
                        "Atlassian JIRA, Confluence, MS Project",
                        "Agile / Scrum",
                        "Составление вариантов использования ПО",
                        "Функциональные и нефункциональные требования к ПО",
                        "Написание Технического задания",
                    ],
                },
                {
                    "id": 2,
                    "title": "Frontend",
                    "content": [
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
                    "id": 3,
                    "title": "Backend",
                    "content": [
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
                    "id": 4,
                    "title": "Databases",
                    "content": [
                        "Redis",
                        "MongoDB",
                        "Neo4J",
                        "Oracle",
                        "Hadoop",
                        "MySQL, PostgreSQL, MS SQL",
                    ],
                },
                {
                    "id": 5,
                    "title": "DevOps/SRE/Support",
                    "content": [
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
                    "id": 6,
                    "title": "Machine learning",
                    "content": [
                        "TensorFlow",
                        "Theano",
                        "Apache Spark",
                        "PyTorch",
                        "Python",
                        "Scikit-learn",
                        "Keras",
                    ],
                },
            ],
            ensure_ascii=False,
        ),
        ContentValueType.JSON,
    ),
]


CARDS_SEED: list[dict[str, Any]] = [
    {
        "title": "Pichta",
        "description": "Система построения индивидуальной траектории развития специалиста.",
        "image_path": "images/full.png",
        "stack": [
            "images/stack/python.svg",
            "images/stack/docker.svg",
            "images/stack/carbon.svg",
            "images/stack/fastapi.svg",
        ],
        "is_clickable": True,
        "popup_content_key": "popup_project.pichta",
        "position": 0,
        "is_published": True,
    },
    {
        "title": "Breolin",
        "description": "Разработка сервиса знакомств Breolin, скоро будет анонс!",
        "image_path": "images/Brialin3.svg",
        "stack": [],
        "is_clickable": False,
        "popup_content_key": None,
        "position": 1,
        "is_published": True,
    },
]


SERVICES_SEED: list[dict[str, Any]] = [
    {
        "title": "ИТ/ИБ Аудит",
        "description": (
            "Профессиональный аудит ИТ-инфраструктуры и кибербезопасности с "
            "разработкой дорожной карты по автоматизации ключевых бизнес-процессов "
            "для роста эффективности и безопасности вашей компании."
        ),
        "image_path": "images/services/audi.svg",
        "position": 0,
    },
    {
        "title": "Искусственный интеллект",
        "description": (
            "Экспертный аудит по интеграции ИИ-решений в компанию: проанализируем "
            "данные, процессы и инфраструктуру, построим пошаговую стратегию "
            "внедрения решений с использованием технологий искусственного "
            "интеллекта для оптимизации бизнес-процессов компании."
        ),
        "image_path": "images/services/Ai.png",
        "position": 1,
    },
    {
        "title": "Разработка",
        "description": (
            "Проектирование и разработка ПО под ключ: от глубокого анализа "
            "бизнес-процессов и сбора требований до создания, внедрения и "
            "постоянного сопровождения IT решения."
        ),
        "image_path": "images/services/dev.svg",
        "position": 2,
    },
    {
        "title": "Jira",
        "description": (
            "Внедряем и поддерживаем ITSM/ESM-системы на базе Atlassian, "
            "автоматизируя рабочие процессы IT, HR, финансов и других отделов "
            "под задачи малого, среднего и крупного бизнеса."
        ),
        "image_path": "images/services/jira.svg",
        "position": 3,
    },
]


PROJECTS_SEED: list[dict[str, Any]] = [
    {
        "title": "Автоматизация бизнес-процессов Порта",
        "description": (
            "Был проведён аудит существующих систем, аудит процессов обработки "
            "информации в Компании и были сформированы рекомендации по оптимизации "
            "ключевых бизнес-процессов."
        ),
        "image_path": "images/projects/bgCover1.png",
        "position": 0,
    },
    {
        "title": "Создание программно-аппаратного комплекса для мониторинга состояния груза",
        "description": (
            "Создание комплексного решения для контроля температурно-влажностных "
            "показателей груза во время перевозки и хранения."
        ),
        "image_path": "images/projects/bgCover2.png",
        "position": 1,
    },
    {
        "title": "Создание программно-аппаратного комплекса для строительного концерна",
        "description": (
            "Создание ПО для проверки соответствия нормам требований по безопасности "
            "труда и контролю сроков обеспечения стройки подрядчиками."
        ),
        "image_path": "images/projects/bgCover3.png",
        "position": 2,
    },
]


PARTNERS_SEED: list[dict[str, Any]] = [
    {
        "title": "Google",
        "description": (
            "Корпоративные облачные решения и интеграция сервисов Google Workspace."
        ),
        "image_path": "https://cdn.simpleicons.org/google/4285F4",
        "position": 0,
    },
    {
        "title": "Microsoft",
        "description": (
            "Внедрение платформ Azure и корпоративной экосистемы Microsoft 365."
        ),
        "image_path": "images/partners/microsoft.svg",
        "position": 1,
    },
    {
        "title": "Amazon Web Services",
        "description": "Построение масштабируемой облачной инфраструктуры на базе AWS.",
        "image_path": "images/partners/aws.svg",
        "position": 2,
    },
    {
        "title": "IBM",
        "description": "Консалтинг и разработка enterprise-решений для крупного бизнеса.",
        "image_path": "images/partners/ibm.svg",
        "position": 3,
    },
    {
        "title": "Oracle",
        "description": "Системы управления данными и корпоративные бизнес-приложения.",
        "image_path": "images/partners/oracle.svg",
        "position": 4,
    },
    {
        "title": "SAP",
        "description": "ERP-интеграции и автоматизация ключевых бизнес-процессов.",
        "image_path": "https://cdn.simpleicons.org/sap/0FAAFF",
        "position": 5,
    },
    {
        "title": "Intel",
        "description": "Аппаратные платформы и оптимизация высоконагруженных систем.",
        "image_path": "https://cdn.simpleicons.org/intel/0071C5",
        "position": 6,
    },
    {
        "title": "Samsung",
        "description": "Технологические партнёрства в области IoT и мобильных решений.",
        "image_path": "https://cdn.simpleicons.org/samsung/1428A0",
        "position": 7,
    },
]


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        # content
        existing_keys = {
            row[0]
            for row in (
                await session.execute(select(Content.key))
            ).all()
        }
        for key, value, vtype in CONTENT_SEED:
            if key in existing_keys:
                continue
            session.add(Content(key=key, value=value, value_type=vtype))

        # cards
        existing_card_titles = {
            row[0]
            for row in (await session.execute(select(Card.title))).all()
        }
        for item in CARDS_SEED:
            if item["title"] in existing_card_titles:
                continue
            session.add(Card(**item))

        # services
        existing_service_titles = {
            row[0]
            for row in (await session.execute(select(Service.title))).all()
        }
        for item in SERVICES_SEED:
            if item["title"] in existing_service_titles:
                continue
            session.add(Service(**item))

        # projects
        existing_project_titles = {
            row[0]
            for row in (await session.execute(select(Project.title))).all()
        }
        for item in PROJECTS_SEED:
            if item["title"] in existing_project_titles:
                continue
            session.add(Project(**item))

        # partners
        partner_logo_updates = {
            item["title"]: item["image_path"]
            for item in PARTNERS_SEED
            if item.get("image_path", "").startswith("images/partners/")
        }
        existing_partners = (
            await session.execute(select(Partner))
        ).scalars().all()
        existing_partner_titles = {p.title for p in existing_partners}
        for partner in existing_partners:
            new_path = partner_logo_updates.get(partner.title)
            if new_path and partner.image_path != new_path:
                partner.image_path = new_path
        for item in PARTNERS_SEED:
            if item["title"] in existing_partner_titles:
                continue
            session.add(Partner(**item))

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
