import { IComment, IMessage, ApiResult } from "@/types/Notification";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let MOCK_COMMENTS: IComment[] = [];
let MOCK_MESSAGES: IMessage[] = [
  {
    tinNhanId: "MSG_1",
    nguoiGui: "Nguyễn Văn B",
    nguoiGuiId: "USER_2",
    noiDung: "Chào cả nhà, cuối tuần này họp họ lúc mấy giờ nhỉ?",
    ngayGui: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    tinNhanId: "MSG_2",
    nguoiGui: "Admin",
    nguoiGuiId: "USER_1",
    noiDung: "8h sáng chủ nhật nhé chú B.",
    ngayGui: new Date(Date.now() - 1800000).toISOString(),
  },
];

// --- COMMENTS ---
export const getComments = async (
  objectId: string
): Promise<ApiResult<IComment[]>> => {
  await delay(300);
  const comments = MOCK_COMMENTS.filter((c) => c.doiTuongId === objectId).sort(
    (a, b) => new Date(b.ngayTao).getTime() - new Date(a.ngayTao).getTime()
  );
  return { code: 200, message: "Success", data: comments };
};

export const addComment = async (
  comment: Partial<IComment>
): Promise<ApiResult<IComment>> => {
  await delay(200);
  const newComment = {
    ...comment,
    binhLuanId: `CMT_${Date.now()}`,
    ngayTao: new Date().toISOString(),
  } as IComment;
  MOCK_COMMENTS.unshift(newComment);
  return { code: 200, message: "Success", data: newComment };
};

// --- CHAT ---
export const getMessages = async (): Promise<ApiResult<IMessage[]>> => {
  await delay(200);
  return { code: 200, message: "Success", data: [...MOCK_MESSAGES] };
};

export const sendMessage = async (
  msg: Partial<IMessage>
): Promise<ApiResult<IMessage>> => {
  await delay(100);
  const newMessage = {
    ...msg,
    tinNhanId: `MSG_${Date.now()}`,
    ngayGui: new Date().toISOString(),
  } as IMessage;
  MOCK_MESSAGES.push(newMessage);
  return { code: 200, message: "Success", data: newMessage };
};
