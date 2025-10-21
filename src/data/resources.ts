export type Resource = {
  title: string
  url: string
  source?: string
  tags?: string[]
}

export const javaResources: Resource[] = [
  { title: 'Spring Boot Reference Documentation', url: 'https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/', source: 'Spring', tags: ['Java', 'Spring Boot'] },
  { title: 'Java Concurrency in Practice', url: 'https://jcip.net/', source: 'JCIP', tags: ['Java', 'Concurrency'] },
  { title: 'Java Design Patterns', url: 'https://refactoring.guru/design-patterns/java', source: 'Refactoring Guru', tags: ['Java', 'Design Patterns'] },
  { title: 'Java Performance Tuning Guide', url: 'https://www.oracle.com/java/technologies/javase/performance-tips.html', source: 'Oracle', tags: ['Java', 'Performance'] },
]

export const jsResources: Resource[] = [
  { title: 'React Official Documentation', url: 'https://react.dev/', source: 'React', tags: ['JavaScript', 'React'] },
  { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', source: 'TypeScript', tags: ['JavaScript', 'TypeScript'] },
  { title: 'Node.js Best Practices', url: 'https://github.com/goldbergyoni/nodebestpractices', source: 'GitHub', tags: ['JavaScript', 'Node.js'] },
  { title: 'Modern JavaScript Tutorial', url: 'https://javascript.info/', source: 'javascript.info', tags: ['JavaScript', 'Modern JS'] },
]

export const csharpResources: Resource[] = [
  { title: 'C# Documentation', url: 'https://docs.microsoft.com/en-us/dotnet/csharp/', source: 'Microsoft', tags: ['C#', 'Documentation'] },
  { title: 'Entity Framework Core', url: 'https://docs.microsoft.com/en-us/ef/core/', source: 'Microsoft', tags: ['C#', 'EF Core'] },
  { title: 'ASP.NET Core Tutorial', url: 'https://docs.microsoft.com/en-us/aspnet/core/tutorials/', source: 'Microsoft', tags: ['C#', 'ASP.NET'] },
  { title: 'C# Design Patterns', url: 'https://refactoring.guru/design-patterns/csharp', source: 'Refactoring Guru', tags: ['C#', 'Design Patterns'] },
]

export const flutterResources: Resource[] = [
  { title: 'Flutter Documentation', url: 'https://docs.flutter.dev/', source: 'Flutter', tags: ['Flutter', 'Documentation'] },
  { title: 'Dart Language Tour', url: 'https://dart.dev/guides/language/language-tour', source: 'Dart', tags: ['Flutter', 'Dart'] },
  { title: 'Flutter Widget Catalog', url: 'https://docs.flutter.dev/development/ui/widgets', source: 'Flutter', tags: ['Flutter', 'UI'] },
  { title: 'Flutter State Management', url: 'https://docs.flutter.dev/development/data-and-backend/state-mgmt', source: 'Flutter', tags: ['Flutter', 'State'] },
]

