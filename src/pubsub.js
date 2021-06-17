import { PubSub } from "apollo-server-express"; // 실제 플젝에서는 Redis의 PubSub 사용해야 함, 이건 교육용 but Redis는 유료

const pubsub = new PubSub();

export default pubsub;