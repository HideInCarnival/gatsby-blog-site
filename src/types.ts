export type blog = {
  cols: col[]
}

type col = {
  dirName: string,
  typeName: string,
  iconName: string
}

export type blogDetailNode = {
  node: {
    frontmatter: {
      date: string,
      title: string
    },
    html: string,
    id: string,
    fields: {
      relativeDirectory: string
    }
  }
}
export type mdInfo = {
  id: string,
  html: string,
  frontmatter: {
    date: string,
    title: string
  },
  fields: {
    relativeDirectory: string
  }
}