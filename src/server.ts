import cors from 'cors';
import express, { Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

// Simple in-memory stores that mimic persistent data.
const memories: Memory[] = [];
const chatHistory: ChatMessage[] = [];
const loveLetter: LoveLetter = {
  author: '宗睿',
  recipient: '代琪',
  title: '致 代琪',
  content:
    '亲爱的：\n\n感谢你成为我生活中的“专属温暖”。无论平静的午后，还是喧嚣的夜晚，我都想第一时间把喜悦和烦恼告诉你。\n\n这份网站想记录我们“回忆、美食、游戏、聊天”的每一个瞬间，它不只是一份作业，更是我们的数字小窝。希望未来有更多的故事被放进这里。\n\n愿你开心、健康，也愿我始终有勇气守护你。\n\n爱你的，宗睿',
  date: new Date().toISOString()
};

interface Memory {
  id: string;
  fileName: string;
  caption?: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  createdAt: string;
}

interface LoveLetter {
  author: string;
  recipient: string;
  title: string;
  content: string;
  date: string;
}

interface GameCard {
  id: string;
  title: string;
  description: string;
  action: string;
}

const app = express();
const port = process.env.PORT || 8080;
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/api/game-cards', (_req: Request, res: Response) => {
  const cards: GameCard[] = [
    {
      id: 'hearts',
      title: '爱情默契卡',
      description: '10道甜蜜小问答，测试彼此的默契值并生成专属徽章。',
      action: '开始'
    },
    {
      id: 'puzzle',
      title: '爱的拼图游戏',
      description: '上传一张照片，自动生成 3x3 拼图，限时完成挑战。',
      action: '组拼'
    },
    {
      id: 'memory',
      title: '甜蜜照片墙',
      description: '把我们的照片、合影、旅行纪念都上传成相册墙。',
      action: '看回忆'
    }
  ];

  res.json(cards);
});

app.get('/api/memories', (_req: Request, res: Response) => {
  res.json(memories);
});

app.post('/api/memories', upload.single('photo'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: '缺少图片文件' });
  }

  const memory: Memory = {
    id: `${Date.now()}`,
    fileName: `/uploads/${req.file.filename}`,
    caption: req.body.caption,
    createdAt: new Date().toISOString()
  };

  memories.unshift(memory);
  res.status(201).json(memory);
});

app.get('/api/chat/history', (_req: Request, res: Response) => {
  res.json(chatHistory);
});

app.post('/api/chat/message', (req: Request, res: Response) => {
  const text: string | undefined = req.body?.text;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: '消息内容不能为空' });
  }

  const userMessage: ChatMessage = {
    id: `${Date.now()}-user`,
    sender: 'user',
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  chatHistory.push(userMessage);

  const botMessage: ChatMessage = {
    id: `${Date.now()}-bot`,
    sender: 'bot',
    text: buildBotReply(text),
    createdAt: new Date().toISOString()
  };

  chatHistory.push(botMessage);

  res.status(201).json({ userMessage, botMessage });
});

app.get('/api/love-letter', (_req: Request, res: Response) => {
  res.json(loveLetter);
});

app.put('/api/love-letter', (req: Request, res: Response) => {
  const { author, recipient, title, content } = req.body;

  if (!author || !recipient || !title || !content) {
    return res.status(400).json({ error: '请填写完整的信件信息' });
  }

  loveLetter.author = author;
  loveLetter.recipient = recipient;
  loveLetter.title = title;
  loveLetter.content = content;
  loveLetter.date = new Date().toISOString();

  res.json(loveLetter);
});

app.get('/api/hero', (_req: Request, res: Response) => {
  res.json({
    primaryName: '樊宗睿',
    secondaryName: '代琪',
    subtitle: '成为你的可爱，是我学会坚强的魔法',
    badge: '恋爱日记'
  });
});

app.get('/api/stats', (_req: Request, res: Response) => {
  res.json({
    loveDays: 288,
    photosCount: memories.length,
    chatCount: chatHistory.length,
    letterDate: loveLetter.date
  });
});

app.use((err: Error, _req: Request, res: Response, _next: () => void) => {
  console.error(err);
  res.status(500).json({ error: '服务器开小差了，请稍后再试' });
});

app.listen(port, () => {
  console.log(`Love story backend is running on http://localhost:${port}`);
});

function buildBotReply(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes('开心') || normalized.includes('快乐')) {
    return '听到你开心我也很开心，我们去吃好吃的庆祝一下吧！';
  }

  if (normalized.includes('难过') || normalized.includes('累')) {
    return '抱抱你，累了就歇一会儿，我来给你煮奶茶，一起慢慢聊～';
  }

  if (normalized.includes('晚安')) {
    return '晚安好梦，做个甜甜的梦，梦到我！';
  }

  return '收到！我一直在这儿陪你，告诉我更多细节，我们一起想办法。';
}
